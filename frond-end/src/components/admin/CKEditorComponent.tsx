import React, { useEffect, useRef, useState } from 'react';

interface CKEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  id?: string;
}

export const CKEditorComponent: React.FC<CKEditorComponentProps> = ({
  value,
  onChange,
  placeholder = 'Rédigez le contenu riche de votre article...',
  id = 'ckeditor-instance',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = useRef<any>(null);
  const isUpdatingFromProp = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initEditor = () => {
      const ClassicEditor = (window as any).ClassicEditor;
      if (!ClassicEditor || !containerRef.current) {
        // Réessayer dans 200ms si le CDN est en cours de chargement
        setTimeout(initEditor, 200);
        return;
      }

      if (editorInstanceRef.current) {
        return;
      }

      ClassicEditor.create(containerRef.current, {
        placeholder,
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'blockQuote',
            'insertTable',
            '|',
            'undo',
            'redo',
          ],
        },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraphe', class: 'ck-heading_paragraph' },
            { model: 'heading2', view: 'h2', title: 'Grand Titre (H2)', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Sous-titre (H3)', class: 'ck-heading_heading3' },
          ],
        },
      })
        .then((editor: any) => {
          if (!isMounted) {
            editor.destroy();
            return;
          }

          editorInstanceRef.current = editor;
          if (value) {
            editor.setData(value);
          }

          editor.model.document.on('change:data', () => {
            if (!isUpdatingFromProp.current) {
              const data = editor.getData();
              onChange(data);
            }
          });

          setIsReady(true);
        })
        .catch((err: any) => {
          console.warn('CKEditor init warning:', err);
        });
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []);

  // Synchronise if value changes externally (e.g. switching article)
  useEffect(() => {
    if (editorInstanceRef.current && isReady) {
      const currentData = editorInstanceRef.current.getData();
      if (value !== currentData) {
        isUpdatingFromProp.current = true;
        editorInstanceRef.current.setData(value || '');
        isUpdatingFromProp.current = false;
      }
    }
  }, [value, isReady]);

  return (
    <div className="ckeditor-dark-wrapper space-y-2">
      <div
        ref={containerRef}
        id={id}
        className="min-h-[260px] rounded-xl overflow-hidden text-[#111a11]"
      />

      <style>{`
        .ckeditor-dark-wrapper .ck-editor__editable {
          min-height: 240px;
          max-height: 480px;
          background-color: #202c1f !important;
          color: #ffffff !important;
          border-color: #3d4f3c !important;
          border-bottom-left-radius: 0.75rem !important;
          border-bottom-right-radius: 0.75rem !important;
          font-family: inherit;
          padding: 1rem !important;
          line-height: 1.6;
        }
        .ckeditor-dark-wrapper .ck-toolbar {
          background-color: #151e15 !important;
          border-color: #3d4f3c !important;
          border-top-left-radius: 0.75rem !important;
          border-top-right-radius: 0.75rem !important;
        }
        .ckeditor-dark-wrapper .ck-button {
          color: #9aad98 !important;
        }
        .ckeditor-dark-wrapper .ck-button:hover {
          background-color: #202c1f !important;
          color: #ffffff !important;
        }
        .ckeditor-dark-wrapper .ck-button.ck-on {
          background-color: #bb0a4a !important;
          color: #ffffff !important;
        }
        .ckeditor-dark-wrapper .ck-dropdown__panel {
          background-color: #151e15 !important;
          border-color: #3d4f3c !important;
        }
        .ckeditor-dark-wrapper .ck-list__item button {
          color: #9aad98 !important;
        }
        .ckeditor-dark-wrapper .ck-list__item button:hover {
          background-color: #202c1f !important;
          color: #ffffff !important;
        }
        .ckeditor-dark-wrapper .ck-placeholder::before {
          color: #6a7d69 !important;
        }
      `}</style>
    </div>
  );
};
