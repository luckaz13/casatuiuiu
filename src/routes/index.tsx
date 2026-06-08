import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import facade from "@/assets/photos/facade.webp";
import living from "@/assets/photos/living.webp";
import exterior from "@/assets/photos/exterior.webp";
import kitchen from "@/assets/photos/kitchen.webp";
import dining from "@/assets/photos/dining.webp";
import bedroom1 from "@/assets/photos/bedroom1.webp";
import bedroom2 from "@/assets/photos/bedroom2.webp";
import bedroom3 from "@/assets/photos/all/20.webp";
import suite2 from "@/assets/photos/all/30.webp";
import suite from "@/assets/photos/suite.webp";
import shower from "@/assets/photos/shower.webp";
import gourmet from "@/assets/photos/gourmet.webp";
import logo from "@/assets/photos/logo1.png";

const allPhotos = Object.entries(
  import.meta.glob<{ default: string }>("../assets/photos/all/*.webp", {
    eager: true,
  }),
)
  .sort((a, b) => {
    const aNum = parseInt(a[0].split("/").pop()?.split(".")[0] || "0");
    const bNum = parseInt(b[0].split("/").pop()?.split(".")[0] || "0");
    return aNum - bNum;
  })
  .map(([_, m]) => m.default);

// Carousel reorder: move 6.webp to first, then swap 3rd ↔ 4th
{
  const [sixth] = allPhotos.splice(5, 1);
  allPhotos.unshift(sixth);
}
[allPhotos[3], allPhotos[4]] = [allPhotos[4], allPhotos[3]];

const photoIndexMap = new Map(allPhotos.map((src, i) => [src, i]));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Casa Tuiuiú — Hospedagem de alto padrão em Bonito, MS" },
      {
        name: "description",
        content:
          "Casa novíssima com 4 quartos, área gourmet e vista para a reserva no Solar dos Lagos, Bonito/MS. Refúgio exclusivo para até 9 hóspedes.",
      },
      { property: "og:title", content: "Casa Tuiuiú — Bonito, MS" },
      {
        property: "og:description",
        content:
          "Refúgio de alto padrão com 4 quartos, varandas com redes e vista para a mata nativa.",
      },
      { property: "og:image", content: facade },
    ],
  }),
  component: Index,
});

const stats = [
  { n: "4", l: "Quartos" },
  { n: "9", l: "Hóspedes" },
  { n: "2+", l: "Vagas de Garagem" },
  { n: "3", l: "Banheiros" },
  { n: "260", l: "m² de área construída" },
  { n: "2 km", l: "do centro de Bonito" },
];

const gallery = [
  { src: living, alt: "Sala de estar integrada", span: "md:col-span-2 md:row-span-2" },
  { src: kitchen, alt: "Cozinha planejada com bancada" },
  { src: dining, alt: "Sala de jantar e escada" },
  { src: suite, alt: "Suíte master" },
  { src: bedroom1, alt: "Quarto duplo" },
  { src: bedroom2, alt: "Quarto twin" },
  { src: gourmet, alt: "Área gourmet com churrasqueira" },
  { src: shower, alt: "Chuveirão ao ar livre" },
  { src: exterior, alt: "Varanda externa" },
];

type Room = { t: string; d: string; img: string };
const roomPhotos: Room[] = [
  { t: "Suíte 1", d: "1 cama de casal · varanda com rede", img: suite },
  { t: "Suíte 2", d: "1 cama de casal · varanda com rede", img: suite2 },
  { t: "Quarto com duas camas de solteiro", d: "2 camas de solteiro", img: bedroom2 },
  { t: "Quarto Triplo", d: "1 cama de casal + 1 cama auxiliar", img: bedroom3 },
];

const amenities = [
  "Ar-condicionado em todos os quartos",
  "Cozinha completa de alto padrão",
  "Churrasqueira e área gourmet",
  "Chuveirão ao ar livre",
  "Redes nas varandas",
  "Wi-Fi e Smart TV",
  "Máquina de lavar e secar",
  "Garagem para 4 veículos",
  "Roupas de cama e banho",
  "Aceita pets de pequeno porte",
  "Ventiladores de teto em todos os quartos",
  "Secador de cabelo",
];

const rules = [
  ["Check-in", "15:00 — 21:00"],
  ["Check-out", "até 11:00"],
  ["Silêncio", "22:00 — 08:00"],
  ["Idade mínima para fazer reservas", "21 anos"],
  ["Crianças e bebês", "Bem-vindos"],
  ["Pets", "Até 2 de pequeno porte (R$ 80/pet)"],
  ["Fumantes", "Não permitido"],
  ["Eventos", "Não permitido"],
];

function Index() {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const openLightbox = (src: string) => {
    const idx = photoIndexMap.get(src);
    if (idx !== undefined) setLightboxIndex(idx);
  };

  const nextImage = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allPhotos.length : null));
  }, []);

  const prevImage = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : null,
    );
  }, []);

  React.useEffect(() => {
    if (lightboxIndex === null) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") setLightboxIndex(null);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, nextImage, prevImage]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-primary-foreground">
          <a href="#top" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Casa Tuiuiú"
              className="h-8 w-8 object-contain brightness-0 invert"
            />
            <span className="font-display text-xl tracking-tight">Casa Tuiuiú</span>
          </a>
          <ul className="hidden gap-8 text-sm md:flex">
            <li>
              <a className="hover:opacity-70" href="#casa">
                A casa
              </a>
            </li>
            <li>
              <a className="hover:opacity-70" href="#galeria">
                Galeria
              </a>
            </li>
            <li>
              <a className="hover:opacity-70" href="#quartos">
                Quartos
              </a>
            </li>
            <li>
              <a className="hover:opacity-70" href="#estadia">
                Estadia
              </a>
            </li>
            <li>
              <a className="hover:opacity-70" href="#contato">
                Contato
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <a
              href="#contato"
              className="rounded-full border border-primary-foreground/40 px-5 py-2 text-sm transition hover:bg-primary-foreground hover:text-primary"
            >
              Reservar
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center p-2 text-primary-foreground hover:opacity-80 md:hidden focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU OVERLAY */}
        <div
          className={`fixed inset-0 z-50 flex flex-col bg-background p-6 transition-all duration-300 md:hidden ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between py-2">
            <a
              href="#top"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <img src={logo} alt="Casa Tuiuiú" className="h-8 w-8 object-contain" />
              <span className="font-display text-xl tracking-tight text-foreground">
                Casa Tuiuiú
              </span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center p-2 text-foreground focus:outline-none"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-6 text-center text-2xl font-light">
              <li>
                <a
                  href="#casa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-foreground hover:text-primary transition"
                >
                  A casa
                </a>
              </li>
              <li>
                <a
                  href="#galeria"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-foreground hover:text-primary transition"
                >
                  Galeria
                </a>
              </li>
              <li>
                <a
                  href="#quartos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-foreground hover:text-primary transition"
                >
                  Quartos
                </a>
              </li>
              <li>
                <a
                  href="#estadia"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-foreground hover:text-primary transition"
                >
                  Estadia
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-foreground hover:text-primary transition"
                >
                  Contato
                </a>
              </li>
            </ul>
            <div className="mt-12 flex justify-center">
              <a
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90 shadow-md"
              >
                Reservar Agora
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src={facade}
          alt="Fachada da Casa Tuiuiú"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/90" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 text-primary-foreground">
          <p className="mb-4 text-lg uppercase tracking-[0.3em] font-semibold text-shadow-md">
            Solar dos Lagos
          </p>
          <h1 className="font-display text-5xl font-light leading-[1.0] md:text-7xl lg:text-8xl text-shadow-lg">
            CASA TUIUIÚ,
            <br />
            {" um refúgio seguro entre a mata"}
            <br />e o silêncio em Bonito, MS
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-shadow-md">
            Casa novíssima de alto padrão, inaugurada em janeiro de 2026. Quatro quartos amplos,
            varandas com redes e vista para a reserva.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-primary-foreground/20 pt-8">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl font-light drop-shadow-sm">{s.n}</div>
                <div className="text-xs uppercase tracking-widest opacity-80 drop-shadow-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section id="casa" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-primary">A casa</p>
            <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
              Moderna, integrada e cercada por natureza
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
            <p>
              Em dois pavimentos, a Casa Tuiuiú reúne ambientes amplos e ventilados. No piso
              superior há duas suítes com quatro varandas na frente e atrás, ambas com redes e vista
              para a mata nos fundos ou a bucólica e tranquila rua. No térreo estão dois quartos,
              banheiro social e living totalmente integrado à cozinha planejada.
            </p>
            <p>
              A área externa nos fundos convida ao descanso: churrasqueira, chuveirão ao ar livre e
              vista contínua para a reserva, onde araras, macacos, maritacas e outras espécies da
              fauna local chegam a fazer parte do cotidiano.
            </p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="galeria" className="bg-secondary/50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">Galeria</p>
              <h2 className="font-display text-4xl font-light md:text-5xl">
                Cada canto, um convite
              </h2>
            </div>
          </div>
          <div className="grid auto-rows-[220px] grid-cols-1 gap-3 md:grid-cols-4 md:auto-rows-[260px]">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className={`group relative overflow-hidden rounded-sm ${g.span ?? ""}`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105 cursor-pointer"
                  onClick={() => openLightbox(g.src)}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section id="quartos" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">Acomodações</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">
            Quatro quartos para até nove pessoas
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-sm bg-border md:grid-cols-2 lg:grid-cols-4">
          {roomPhotos.map((r) => (
            <article key={r.t} className="bg-card">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={r.img}
                  alt={r.t}
                  className="h-full w-full object-cover cursor-pointer"
                  loading="lazy"
                  onClick={() => openLightbox(r.img)}
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl">{r.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FULL GALLERY CAROUSEL */}
      <section className="overflow-hidden bg-background pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">Experiência</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">Cada detalhe importa</h2>
        </div>

        <div className="relative px-6">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="mx-auto max-w-7xl"
          >
            <CarouselContent className="-ml-4">
              {allPhotos.map((src, index) => (
                <CarouselItem key={index} className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                  <div
                    className="overflow-hidden rounded-sm aspect-[3/2] bg-muted cursor-pointer"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={src}
                      alt={`Detalhe ${index + 1}`}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 h-10 w-10" />
              <CarouselNext className="-right-12 h-10 w-10" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* LIGHTBOX DIALOG */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">Visualização da imagem</DialogTitle>
          <div className="relative group flex items-center justify-center w-full h-full">
            {lightboxIndex !== null && (
              <>
                <img
                  src={allPhotos[lightboxIndex]}
                  alt={`Foto ${lightboxIndex + 1}`}
                  className="max-w-full max-h-[90vh] object-contain rounded-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40 border border-white"
                  onClick={() => setLightboxIndex(null)}
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Navigation Buttons inside Lightbox */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 pointer-events-auto"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 pointer-events-auto"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/20 px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {allPhotos.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AMENITIES + STAY */}
      <section id="estadia" className="bg-accent text-accent-foreground">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-70">Comodidades</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Pensada para o descanso
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-y-3 sm:grid-cols-2">
              {amenities.map((a) => (
                <li key={a} className="flex items-start gap-3 text-sm">
                  <span className="mt-2 h-px w-4 bg-current opacity-50" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-70">Sobre a estadia</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">Regras e horários</h2>
            <dl className="mt-10 divide-y divide-current/15 border-y border-current/15">
              {rules.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between py-4 text-sm">
                  <dt className="opacity-70">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">Localização</p>
            <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
              Solar dos Lagos, Bonito — MS
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
            <p>
              Bairro residencial nobre, silencioso e seguro, com fácil acesso às principais vias da
              cidade. A casa faz divisa com mata nativa — a fauna passa pelos quintais e varandas
              com naturalidade.
            </p>
            <p>
              Recomendamos chegar de carro para mais comodidade durante os passeios pelos atrativos
              da região. Garagem gratuita para até quatro veículos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contato" className="relative overflow-hidden">
        <img src={exterior} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center text-primary-foreground md:py-32">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-80">Reservas</p>
          <h2 className="font-display text-4xl font-light leading-tight md:text-6xl">
            Sua estadia em Bonito
            <br />
            <span className="italic">começa aqui</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl opacity-90">
            Atendimento pela equipe Mai Casas, disponível antes, durante e após a estadia.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5567991318133"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary-foreground px-8 py-3 text-sm font-medium text-primary transition hover:opacity-90"
            >
              Falar no WhatsApp
            </a>
            <a
              href="mailto:maira@maicasas.com"
              className="rounded-full border border-primary-foreground/50 px-8 py-3 text-sm font-medium transition hover:bg-primary-foreground/10"
            >
              Enviar e-mail
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-3 font-display text-lg text-foreground">
            <img src={logo} alt="Casa Tuiuiú" className="h-8 w-8 object-contain" />
            <span>Casa Tuiuiú</span>
          </div>
          <p>Solar dos Lagos · Bonito, MS · Brasil</p>
        </div>
      </footer>
    </div>
  );
}
