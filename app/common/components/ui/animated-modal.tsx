import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './button';
import { Form } from 'react-router';

interface AnimatedModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  letterId: number;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  trigger,
  title,
  children,
  letterId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const [answerOpen, setAnswerOpen] = useState(false);

  const writeAnswerButtonRef = useRef<HTMLDivElement>(null); 
  
  const [modalContentHeight, setModalContentHeight] = useState(0); 
  const formContainerRef = useRef<HTMLDivElement>(null); 
  const childrenContainerRef = useRef<HTMLDivElement>(null); 
  const headerRef = useRef<HTMLDivElement>(null); 


  const handleModalOpenChange = (isModalOpen: boolean) => {
    if (isModalOpen && triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setModalOpen(isModalOpen);
  };

  useLayoutEffect(() => {
    if (modalOpen) {
      const measureHeights = () => {
        let calculatedHeight = 0;

        if (headerRef.current) {
            calculatedHeight += headerRef.current.offsetHeight;
        }

        if (childrenContainerRef.current) {
            calculatedHeight += childrenContainerRef.current.scrollHeight;
        }
        
        if (writeAnswerButtonRef.current && !answerOpen) { 
            calculatedHeight += writeAnswerButtonRef.current.offsetHeight;
        }
        
        if (answerOpen && formContainerRef.current) {
          calculatedHeight += formContainerRef.current.scrollHeight; 
          calculatedHeight += 16; 
        }
        
        calculatedHeight += 48; 

        setModalContentHeight(Math.max(calculatedHeight, 200)); 
      };

      measureHeights(); 
    } else {
      setModalContentHeight(0);
      setAnswerOpen(false);
    }
  }, [modalOpen, answerOpen]);

  const buttonVariants = {
    initial: { opacity: 1, pointerEvents: 'auto' },
    hidden: { opacity: 0, pointerEvents: 'none', transition: { duration: 0.3 } }
  };

  const formContentVariants = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.4 } },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.6, delay: 0.1 }
    },
  };

  return (
    <Dialog.Root open={modalOpen} onOpenChange={handleModalOpenChange}>
      <Dialog.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {trigger}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal forceMount>
        <AnimatePresence>
          {modalOpen && ( 
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalOpen && triggerRect && ( 
            <Dialog.Content asChild>
              <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation(); 
                  setModalOpen(false); 
                }}
              >
                <motion.div
                  key="modalContent" 
                  className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative modal-content-box flex flex-col overflow-hidden" 
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    x: triggerRect.left + triggerRect.width / 2 - window.innerWidth / 2,
                    y: triggerRect.top + triggerRect.height / 2 - window.innerHeight / 2,
                    rotateX: 15,
                    height: modalContentHeight > 0 ? modalContentHeight : 200, // 초기 높이를 미리 설정
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotateX: 0,
                    height: modalContentHeight > 0 ? modalContentHeight : 'auto', 
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    x: triggerRect.left + triggerRect.width / 2 - window.innerWidth / 2,
                    y: triggerRect.top + triggerRect.height / 2 - window.innerHeight / 2,
                    rotateX: -15,
                  }}
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 300,
                    duration: 0.25, 
                    height: { duration: 0.6 } 
                  }}
                  onClick={(e) => e.stopPropagation()} 
                >
                  <div ref={headerRef} className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      {title}
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                      당신에게 온 편지, {title}에 대한 내용입니다.
                    </Dialog.Description>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="rounded-full p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>
                    </Dialog.Close>
                  </div>
                  
                  <div ref={childrenContainerRef} className="flex flex-col mb-4">
                    {children}
                  </div>

                  <div className="w-full flex-grow flex flex-col relative justify-end">
                    <motion.div
                      key="answerForm" 
                      ref={formContainerRef}
                      initial="hidden"
                      animate="visible"
                      exit="hidden" 
                      variants={formContentVariants}
                      className="w-full flex flex-col gap-2 overflow-y-auto" 
                      style={{ maxHeight: '100%' }} 
                    >
                      <Form method="post" action="/room" className='flex flex-col gap-2'>
                        <input type="hidden" name="letter_id" value={letterId} />
                        <input type="hidden" name="intent" value="answer-letter" />
                        <textarea
                          name="answer"
                          placeholder="이 고민에 대한 당신의 답변을 작성해주세요..."
                          className='border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none w-full'
                          required
                        />
                        <motion.div
                          ref={writeAnswerButtonRef}
                          className="w-full absolute bottom-0 left-0" 
                          initial="initial"
                          animate={answerOpen ? "hidden" : "initial"} 
                          variants={buttonVariants}
                        >
                          <Button
                            type={answerOpen ? "submit" : "button"} 
                            onClick={() => {
                              if (!answerOpen) {
                                console.log("답변 작성하기 버튼 클릭");
                                setAnswerOpen(true);
                                console.log("답변 작성하기 버튼 클릭 후 답변 작성 폼 보여질거임");
                              }
                            }}
                            className='w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 mt-2'
                          >
                            {answerOpen ? "답변 제출" : "답변 작성하기"}
                          </Button>
                        </motion.div>
                      </Form>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};