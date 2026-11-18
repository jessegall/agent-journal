<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Support\RecordIdentity;

/**
 * The record whose published content a share shows, read after its path and authority were checked.
 */
final readonly class ShareContentRead
{
    public function __construct(public RecordIdentity $record) {}
}
