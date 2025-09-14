"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2",
        },
      }),
      Typography,
      TextStyle,
      Color,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-3 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <TooltipProvider>
      <div className={cn("border rounded-lg overflow-hidden", className)}>
        <div className="border-b bg-muted/50 p-2 flex items-center gap-1 flex-wrap">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("heading", { level: 1 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  aria-label="Toggle heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 1</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("heading", { level: 2 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  aria-label="Toggle heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 2</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("heading", { level: 3 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  aria-label="Toggle heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 3</p>
              </TooltipContent>
            </Tooltip>
          </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                aria-label="Toggle bold"
              >
                <Bold className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold (Ctrl+B)</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                aria-label="Toggle italic"
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic (Ctrl+I)</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                aria-label="Toggle strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Strikethrough</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                aria-label="Toggle code"
              >
                <Code className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inline Code</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                aria-label="Toggle bullet list"
              >
                <List className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bullet List</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                aria-label="Toggle ordered list"
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Numbered List</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBlockquote().run()
                }
                aria-label="Toggle blockquote"
              >
                <Quote className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quote</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("link")}
                onPressedChange={setLink}
                aria-label="Add link"
              >
                <LinkIcon className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Link</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                aria-label="Undo"
              >
                <Undo className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                aria-label="Redo"
              >
                <Redo className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 0.67em 0;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.75em 0;
        }

        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: 600;
          margin: 0.83em 0;
        }

        .ProseMirror p {
          margin: 1em 0;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1em 0;
        }

        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror ul ul {
          list-style-type: circle;
        }

        .ProseMirror ul ul ul {
          list-style-type: square;
        }

        .ProseMirror li {
          margin: 0.25em 0;
          display: list-item;
        }

        .ProseMirror li > p {
          margin: 0;
        }

        .ProseMirror li > p:first-child {
          margin: 0;
        }

        .ProseMirror blockquote {
          padding-left: 1rem;
          border-left: 3px solid #e9ecef;
          margin: 1em 0;
        }

        .ProseMirror code {
          background-color: rgba(97, 97, 97, 0.1);
          color: #616161;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.85em;
        }

        .dark .ProseMirror code {
          background-color: rgba(255, 255, 255, 0.1);
          color: #e0e0e0;
        }

        .ProseMirror pre {
          background: #0d0d0d;
          color: #fff;
          font-family: "JetBrainsMono", monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin: 1em 0;
        }

        .ProseMirror pre code {
          color: inherit;
          padding: 0;
          background: none;
          font-size: 0.8rem;
        }

        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e9ecef;
          margin: 2em 0;
        }

        .dark .ProseMirror hr {
          border-top-color: #374151;
        }
      `}</style>
      </div>
    </TooltipProvider>
  );
}
