class HelloWorldController < ApplicationController

  def index
    @appstate = { name: 'Stranger' }
    render_appstate
  end
end
