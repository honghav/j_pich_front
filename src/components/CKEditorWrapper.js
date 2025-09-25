// components/CKEditorWrapper.js
'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function CKEditorWrapper({ value, onChange }) {
  return (
    
    <div className="h-[200px] border rounded overflow-auto">
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
    </div>

  );
}
