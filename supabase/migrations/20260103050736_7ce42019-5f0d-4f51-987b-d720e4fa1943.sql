-- Atualizar a função handle_new_user para usar 14 dias de trial ao invés de 21
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  is_adv BOOLEAN;
BEGIN
  is_adv := COALESCE((NEW.raw_user_meta_data->>'is_advertiser')::boolean, false);
  
  INSERT INTO public.profiles (id, full_name, phone, is_advertiser, trial_ends_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    is_adv,
    CASE WHEN is_adv THEN now() + INTERVAL '14 days' ELSE NULL END
  );
  
  -- Adicionar role baseado no tipo de usuário
  IF is_adv THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'advertiser');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  END IF;
  
  RETURN NEW;
END;
$function$;