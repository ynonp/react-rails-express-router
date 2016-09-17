class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  respond_to :html, :json

  def render_appstate
    response.headers['Cache-Control'] = 'no-cache, no-store, max-age=0, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = 'Fri, 01 Jan 1990 00:00:00 GMT'

    respond_with(@appstate) do |format|
      format.html do
        render file: 'app/views/layouts/application.html.erb', layout: false
      end
      format.json do
        render json: @appstate
      end
    end
  end
end
