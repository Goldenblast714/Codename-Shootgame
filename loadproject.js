/* globals Wick, createjs, Blob */
document.title = 'Loading...'
window.onload = function () {
  function handleComplete () {
    var projectData = queue.getResult( 'project' )
    Wick.WickFile.fromWickFile( new Blob( [ new Uint8Array( projectData ) ] ), project => {
      playProject( project )
    } )
  }

  function handleProgress ( event ) {
    const container = document.getElementById( 'loading-bar' )
    container.innerHTML = ( ( event.loaded * 100 ).toFixed( 1 ) ) + '%'
    document.querySelector( 'progress' ).value = ( ( event.loaded * 100 ).toFixed( 1 ) )
  }

  function playProject ( project ) {
    window.project = project

    document.title = project.name

    container.innerHTML = ''
    project.view.renderMode = 'webgl'
    project.view.canvasContainer = container
    project.view.fitMode = 'fill'
    project.view.canvasBGColor = '#000000'

    window.onresize = function () {
      project.view.resize()
    }
    project.view.resize()
    this.project.view.prerender()

    project.focus = project.root
    project.focus.timeline.playheadPosition = 1

    project.play( {
      onAfterTick: () => {
        project.view.render()
      },
      onError: error => {
        console.error( 'Project threw an error!' )
        console.error( error )
        document.documentElement.innerHTML = `

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> 
    <title>Error!</title>
    <link rel='shortcut icon' type='image/png' href='./icon.png'/>
  </head>

  <body
    style="background: linear-gradient(to top right, black, red); height: 100vh; overflow: hidden; color: white; text-align: center; font-size: 3vw;">
    <h1 style="float:left; margin-left: 2em; font-weight: 100;">:(</h1>
    <h3>Oops! An error occured.</h3>
    <code style="font-size: 0.6em;">Error on line ${error.lineNumber }: ${ error.message }</code>
    <br>
    <small>
      <a style="color: white; text-decoration-style: dotted;"
        href="https://github.com/Goldenblast714/Codename-Shootgame/issues/new?labels=bug&title=Error on ${error.lineNumber }: ${ encodeURIComponent(error.message) }">Report this bug</a>
    </small>
  </body>`
      }
    } )
  }

  var container = document.getElementById( 'wick-canvas-container' )
  var queue = new createjs.LoadQueue()
  queue.on( 'complete', handleComplete, this )
  queue.on( 'progress', handleProgress, this )
  queue.loadManifest( [
    { id: 'project', src: 'CodeName_ShootGame.wick', type: createjs.Types.BINARY },
    { id: 'wickengine', src: 'wickengine.js', type: createjs.Types.JAVASCRIPT }
  ] )
}
