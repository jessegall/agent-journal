<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Support\RecordIdentity;

/**
 * What the owner asked to preview: the root record and the linked records chosen to go with it, empty before any
 * choice.
 */
final readonly class ShareSelection
{
    /**
     * @param  list<RecordIdentity>  $linked
     */
    public function __construct(
        public RecordIdentity $root,
        public array $linked,
    ) {}
}
