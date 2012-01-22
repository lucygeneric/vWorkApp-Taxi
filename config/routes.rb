VWorkAppTaxi::Application.routes.draw do
  
  namespace :admin do
    resources :companies do
      get 'logo', :on => :member
      get 'icon', :on => :member
    end
  end

  namespace :call_center do
    resources :bookings
    get 'routing/entry'
    get 'routing/redirect'
  end

  resources :bookings

  match '/main/logo/:id' => 'main#logo', :as => :logo
  match '/main/icon/:id' => 'main#icon', :as => :icon

  root :to => "main#index"

end
