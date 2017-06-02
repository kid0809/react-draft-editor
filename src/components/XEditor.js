import React from 'react'
import {Editor, EditorState, RichUtils, convertToRaw, Modifier, CompositeDecorator, AtomicBlockUtils} from 'draft-js'
import {stateToHTML} from 'draft-js-export-html'
import Controls from './Controls'

import '../public/css/Xeditor.css'
import '../public/css/Draft.css'


class XEditor extends React.Component {
  constructor(props) {
    super(props)
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ])

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      showURLInput: false,
      showImgInput: false,
      urlValue: '',
      url: '',
    }

    this.onChange = (editorState) => this.setState({editorState})
    this.toggleInlineButton = (inlineStyle) => this._toggleInlineButton(inlineStyle)
    this.toggleBlockType = (type) => this._toggleBlockType(type)
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor)
    this.promptForLink = this._promptForLink.bind(this)
    this.onURLChange = (e) => this.setState({urlValue: e.target.value})
    this.closeUrlInput = () => this.setState({showURLInput: false, showImgInput: false})
    this.confirmLink = this._confirmLink.bind(this)
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this)
    this.removeLink = this._removeLink.bind(this)
    this.confirmImage = this._confirmImage.bind(this)
    this.promptForImage = this._promptForImage.bind(this)
    this.onImageKeyDown = this._onImageKeyDown.bind(this)
  }

  // 块级样式
  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    )
  }

  // 行内样式
  _toggleInlineButton(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    )
  }

  // 颜色
  _toggleColor(toggledColor) {
    const {editorState} = this.state
    const selection = editorState.getSelection()

    // 切换颜色时循环之前的所选颜色并去掉
    const nextContentState = Object.keys(colorStyleMap)
      .reduce((contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      }, editorState.getCurrentContent())

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )

    const currentStyle = editorState.getCurrentInlineStyle()

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color)
      }, nextEditorState)
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      )
    }

    this.onChange(nextEditorState)
  }


  // link方法
  _promptForLink() {
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url,
      });
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {editorState, urlValue} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
      showURLInput: false,
      urlValue: '',
    });
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _removeLink(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  // 图片函数
  _confirmImage(e) {
    e.preventDefault()
    const {editorState, urlValue} = this.state
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      {src: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
      showImgInput: false,
      urlValue: '',
    })
  }

  _onImageKeyDown(e) {
    if (e.which === 13) {
      this._confirmImage(e);
    }
  }

  _promptForImage() {
    const {editorState} = this.state
    this.setState({
      showImgInput: true,
      urlValue: '',
    })
  }


  // 转换为HTML
  renderHTML() {
    const {editorState} = this.state
    const contentState = editorState.getCurrentContent()

    const options = {
      inlineStyles: {
        lineThrough: {style: {textDecoration: 'line-through'}},
        red: {style: {color: 'rgba(255, 0, 0, 1.0)'}},
        orange: {style:{color: 'rgba(255, 127, 0, 1.0)'}},
        yellow: {style:{color: 'rgba(180, 180, 0, 1.0)'}},
        green: {style:{color: 'rgba(0, 180, 0, 1.0)'}},
        blue: {style:{color: 'rgba(0, 0, 255, 1.0)'}},
        indigo: {style:{color: 'rgba(75, 0, 130, 1.0)'}},
        violet: {style:{color: 'rgba(127, 0, 255, 1.0)'}}
      },
      blockRenderers: {
        blockquote: (block) => {
          return '<blockquote class="editor-blockquote">' + escape(block.getText()) + '</blockquote>'
        },

        'code-block': (block) => {
          return '<div class="editor-code">' + escape(block.getText()) + '</div>'
        },
      }
    }

    const content = stateToHTML(contentState, options)


    return (
      <div dangerouslySetInnerHTML={{__html: content}} className="draft-html"></div>
    )
  }

  render() {
    const {editorState} = this.state

    // 使用块级样式隐藏placeholder
    let className = 'editor-content'
    const contentState = editorState.getCurrentContent()

    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' editor-hidePlaceholder'
      }
    }


    return (
      <div>
        <div className="editor-root">
          <div className="editor-controls">
            <Controls 
              editorState={editorState}
              onInlineToggle={this.toggleInlineButton}
              onBlockToggle={this.toggleBlockType}
              onColorToggle={this.toggleColor}
              onURLChange={this.onURLChange}
              promptForLink={this.promptForLink}
              confirmLink={this.confirmLink}
              onLinkInputKeyDown={this.onLinkInputKeyDown}
              removeLink={this.removeLink}
              closeUrlInput={this.closeUrlInput}
              urlValue={this.state.urlValue}
              showURLInput={this.state.showURLInput}
              showImgInput={this.state.showImgInput}
              confirmImage = {this.confirmImage}
              promptForImage = {this.promptForImage}
              onImageKeyDown = {this.onImageKeyDown} />
          </div>
          <div className={className}>
            <Editor 
              editorState={this.state.editorState} 
              onChange={this.onChange} 
              placeholder="Tell a story..."
              blockStyleFn={getBlockStyle}
              blockRendererFn={mediaBlockRenderer}
              customStyleMap={styleMap}
              ref="editor" />
          </div>
        </div>
        {this.renderHTML()}
      </div>
    )
  }
}

// 图片样式
function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }

  return null
}

const Image = (props) => {
  return <img src={props.src} style={{ width: '100%' }} />
}

const Media = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  )
  const {src} = entity.getData();

  return (<Image src={src} />)
}


function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      )
    },
    callback
  )
}



// 自定义块级样式
function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'editor-blockquote'
    default: return null
  }
}

// 自定义颜色
const colorStyleMap = {
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
}


// 自定义样式

const styleMap = {
  lineThrough: {
    textDecoration: 'line-through'
  },
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
}

// link装饰器
function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      )
    },
    callback
  )
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData()
  return (
    <a href={url} style={{ color: '#3b5998', textDecoration: 'underline' }}>
      {props.children}
    </a>
  )
}

export default XEditor
