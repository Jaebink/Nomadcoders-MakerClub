import React, { useRef, useState, useLayoutEffect } from 'react';
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
  errorMessage: {
    answer?: string;
    sendingAnswer?: string;
  } | undefined;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({ trigger, title, children, letterId, errorMessage }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  
  const [answerOpen, setAnswerOpen] = useState(false);
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const childrenContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const writeAnswerButtonRef = useRef<HTMLDivElement>(null);
  
  const [modalContentHeight, setModalContentHeight] = useState<number | 'auto'>(0);
  
  const textareaVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', maxHeight: '100px', transition: { maxHeight: { duration: 0.5 } } }
  };
  
  const handleModalOpenChange = (isModalOpen: boolean) => {
    if (isModalOpen && triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setModalOpen(isModalOpen);
  };
  
  useLayoutEffect(() => {
    let observer: ResizeObserver | null = null;
    
    if (modalOpen) {
      const measureHeights = () => {
        let currentTotalHeight = 0;
        
        if (modalRef.current) {
          currentTotalHeight = modalRef.current.scrollHeight;
        }
        
        if (answerOpen && modalRef.current) {
          currentTotalHeight = modalRef.current.scrollHeight;
          currentTotalHeight += 24;
        }
        
        setModalContentHeight(currentTotalHeight);
      };
      
      observer = new ResizeObserver(measureHeights);
      
      if (textareaRef.current) {
        observer.observe(textareaRef.current);
      }
      
      if (answerOpen) {
        measureHeights();
    } else {
        measureHeights();
    }
      
    } else {
      setModalContentHeight('auto');
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [modalOpen, answerOpen]);
  
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
                  setAnswerOpen(false);
                }}
              >
                <motion.div
                  key="modalContent" 
                  className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative flex flex-col gap-4"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    x: triggerRect.left + triggerRect.width / 2 - window.innerWidth / 2,
                    y: triggerRect.top + triggerRect.height / 2 - window.innerHeight / 2,
                    height: modalContentHeight,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotateX: 0,
                    height: modalContentHeight,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    x: triggerRect.left + triggerRect.width / 2 - window.innerWidth / 2,
                    y: triggerRect.top + triggerRect.height / 2 - window.innerHeight / 2,
                    height: modalContentHeight,
                  }}
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 300,
                    duration: 1,
                    height: { duration: 0.2, type: 'spring', damping: 15, stiffness: 1100 }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  ref={modalRef}
                >
                  <div className="flex justify-between items-center">
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
                  
                  <div ref={childrenContainerRef} className="flex flex-col">
                    {children}
                  </div>
                  
                  <div className="w-full flex-grow flex flex-col relative justify-end">
                    <motion.div
                      key="answerForm" 
                    >
                      <Form method="post" action="/room" className='flex flex-col'>
                        <input type="hidden" name="letter_id" value={letterId} />
                        <input type="hidden" name="intent" value="answer-letter" />
                        <motion.textarea
                          name="answer"
                          placeholder="이 고민에 대한 당신의 답변을 작성해주세요..."
                          className='border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none w-full p-2 overflow-hidden'
                          variants={textareaVariants}
                          initial="hidden"
                          animate={answerOpen ? "visible" : "hidden"}
                          minLength={1}
                          maxLength={1000}
                          rows={4}
                          ref={textareaRef}
                        />
                        {errorMessage && (
                          <motion.div
                            className="text-red-500 text-xs"
                            style={{ whiteSpace: 'pre-line' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {errorMessage.answer}
                          </motion.div>
                        )}
                        {errorMessage && (
                          <motion.div
                            className="text-red-500 text-xs"
                            style={{ whiteSpace: 'pre-line' }}
                          >
                            {errorMessage.sendingAnswer}
                          </motion.div>
                        )}
                        <motion.div
                          className="w-full" 
                          ref={writeAnswerButtonRef}
                        >
                          <Button
                            type={answerOpen ? "submit" : "button"} 
                            onClick={(e) => {
                              if (!answerOpen) {
                                e.preventDefault();
                                setAnswerOpen(true);
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