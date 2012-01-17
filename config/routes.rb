VWorkAppTaxi::Application.routes.draw do
  
  namespace :admin do
    resources :companies do
      get 'logo', :on => :member
    end
  end

  namespace :call_center do
    resources :bookings
    get 'routing/entry'
    get 'routing/redirect'
  end
  resources :bookings

  root :to => "main#index"

end
