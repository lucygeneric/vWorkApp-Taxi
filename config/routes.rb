VWorkAppTaxi::Application.routes.draw do
  
  namespace :admin do
    resources :companies do
      get 'logo', :on => :member
    end
  end

  resources :bookings

  namespace :call_center do
    resources :bookings
    get 'routing/entry'
    get 'routing/redirect'
  end

  root :to => "main#index"

end
