import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@habitamoz.co.mz',
      href: 'mailto:info@habitamoz.co.mz'
    },
    {
      icon: Phone,
      title: 'Telefone',
      value: '+258 84 123 4567',
      href: 'tel:+258841234567'
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: 'Maputo, Moçambique',
      href: null
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      value: 'Seg - Sex: 8h às 18h',
      href: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fale Conosco
            </h1>
            <p className="text-muted-foreground text-lg">
              Tem alguma dúvida ou sugestão? Estamos aqui para ajudar!
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-4">
              {contactInfo.map((item, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.href ? (
                        <a 
                          href={item.href} 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* WhatsApp CTA */}
              <Card className="border-green-500/30 bg-green-500/5">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground mb-2">Prefere WhatsApp?</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Fale conosco diretamente pelo WhatsApp para uma resposta mais rápida.
                  </p>
                  <a
                    href="https://wa.me/258841234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Abrir WhatsApp
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="md:col-span-3 border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Envie sua mensagem
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+258 84 XXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Sobre o que deseja falar?"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escreva sua mensagem aqui..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
