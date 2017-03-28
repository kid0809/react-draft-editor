import React from 'react'
import {Editor, EditorState, RichUtils, convertToRaw, Modifier, CompositeDecorator} from 'draft-js'
import InlineControls from './InlineControls'
import '../public/css/Draft.css'
import '../public/css/RichEditor.css'


class Test extends React.Component {
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
      urlValue: ''
    }

    this.onChange = (editorState) => this.setState({editorState})
    this.toggleInlineButton = (inlineStyle) => this._toggleInlineButton(inlineStyle)
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor)
    this.promptForLink = this._promptForLink.bind(this)
    this.onURLChange = (e) => this.setState({urlValue: e.target.value})
    this.closeUrlInput = () => this.setState({showURLInput: false})
    this.confirmLink = this._confirmLink.bind(this)
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this)
    this.removeLink = this._removeLink.bind(this)
  }


  _toggleInlineButton(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    )
  }


  _toggleColor(toggledColor) {
    const {editorState} = this.state
    const selection = editorState.getSelection()

    // Let's just allow one color at a time. Turn off all active colors.
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

  render() {
    const {editorState} = this.state

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    var contentState = editorState.getCurrentContent()


    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder'
      }
    }

    return (
      <div className="RichEditor-root">
        <InlineControls
          editorState={editorState}
          onToggle={this.toggleInlineButton}
          onColorToggle={this.toggleColor}
          onURLChange={this.onURLChange}
          promptForLink={this.promptForLink}
          confirmLink={this.confirmLink}
          onLinkInputKeyDown={this.onLinkInputKeyDown}
          removeLink={this.removeLink}
          closeUrlInput={this.closeUrlInput}
          urlValue={this.state.urlValue}
          showURLInput={this.state.showURLInput}
        />
        <div className={className}>
          <Editor
            editorState={editorState}
            customStyleMap={styleMap}
            onChange={this.onChange}
            placeholder="Tell a story..."
            ref="editor"
          />
        </div>
      </div>
    )
  }
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

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData()
  return (
    <a href={url} style={{ color: '#3b5998', textDecoration: 'underline',}}>
      {props.children}
    </a>
  )
}

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

const styleMap = {
  LINETHROUGH: {
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


export default Test
