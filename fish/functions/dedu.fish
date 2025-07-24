function dedu --wraps='dotnet ef database update' --description 'alias dedu=dotnet ef database update'
  dotnet ef database update $argv
        
end
