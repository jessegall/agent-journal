<?php

declare(strict_types=1);

/**
 * The model methods of Documents that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'Document::addRevision' => 6,
    'DocumentDraft::closeInto' => 6,
    'Settles::settle' => 6,
    'TextUpload::appendChunk' => 6,
    'TextUpload::pruneExpired' => 6,
];
