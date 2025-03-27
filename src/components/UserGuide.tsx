
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HelpCircle, ChevronRight, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

type GuideStep = {
  title: string;
  description: string;
  image?: string;
};

const guideSteps: GuideStep[] = [
  {
    title: "Selamat Datang di Aplikasi Finansial",
    description: "Aplikasi ini membantu Anda melacak dan mengelola kebiasaan finansial dengan mudah dan efektif.",
    image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Dashboard",
    description: "Dashboard menampilkan ringkasan kebiasaan finansial Anda, distribusi keuangan, dan rekomendasi untuk meningkatkan kesehatan finansial Anda."
  },
  {
    title: "Tambah Kebiasaan",
    description: "Gunakan fitur Tambah Kebiasaan untuk mencatat pengeluaran, pendapatan, atau tabungan baru ke dalam sistem."
  },
  {
    title: "Analisis",
    description: "Halaman Analisis memberikan visualisasi data keuangan Anda dalam bentuk grafik dan chart untuk memudahkan pemahaman."
  },
  {
    title: "Tabungan",
    description: "Halaman Tabungan memungkinkan Anda melacak semua tabungan dan investasi Anda dalam satu tempat."
  },
  {
    title: "Pengaturan",
    description: "Di halaman Pengaturan, Anda dapat mengubah informasi profil dan preferensi aplikasi."
  }
];

export function UserGuideButton() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const handleNext = () => {
    if (step < guideSteps.length - 1) {
      setStep(step + 1);
    } else {
      setOpen(false);
      setStep(0);
    }
  };

  const handleSkip = () => {
    setOpen(false);
    setStep(0);
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep(0);
    }
  };

  const isLastStep = step === guideSteps.length - 1;

  if (isDesktop) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => handleOpen(true)}
              >
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Bantuan</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Panduan Penggunaan</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={open} onOpenChange={handleOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{guideSteps[step].title}</DialogTitle>
              <DialogDescription className="pt-4 space-y-4">
                {guideSteps[step].image && (
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img 
                      src={guideSteps[step].image} 
                      alt={guideSteps[step].title} 
                      className="w-full h-auto object-cover aspect-video"
                    />
                  </div>
                )}
                <p>{guideSteps[step].description}</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                  <span className="text-muted-foreground">Langkah {step + 1} dari {guideSteps.length}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-between items-center gap-2 sm:gap-0">
              <Button variant="ghost" onClick={handleSkip}>
                Lewati
              </Button>
              <Button onClick={handleNext} className="gap-2">
                {isLastStep ? "Selesai" : "Lanjut"}
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={handleOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Bantuan</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{guideSteps[step].title}</DrawerTitle>
            <DrawerDescription className="pt-4 space-y-4">
              {guideSteps[step].image && (
                <div className="overflow-hidden rounded-lg mb-4">
                  <img 
                    src={guideSteps[step].image} 
                    alt={guideSteps[step].title} 
                    className="w-full h-auto object-cover aspect-video"
                  />
                </div>
              )}
              <p>{guideSteps[step].description}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                <span className="text-muted-foreground">Langkah {step + 1} dari {guideSteps.length}</span>
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row justify-between items-center">
            <Button variant="ghost" onClick={handleSkip}>
              Lewati
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {isLastStep ? "Selesai" : "Lanjut"}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
