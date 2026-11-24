<?php

declare(strict_types=1);

/**
 * The Documents transitions that raise facts, each called only inside a unit: a command handler, a required
 * listener or a model (ModelRaiseCallerTest).
 */
return [
    'Document::create',
    'Document::publish',
    'Document::settle',
    'DocumentClose::create',
    'DocumentDraft::create',
    'DocumentDraft::saveText',
    'Report::create',
    'Report::settle',
    'RetainedDraft::create',
    'TextUpload::countChunk',
    'TextUpload::seal',
    'TextUpload::consume',
];
