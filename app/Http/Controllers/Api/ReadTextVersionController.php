<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Text\ReadTextVersionPayload;
use App\Data\Pages\TextVersionSummary;
use App\Reads\Contracts\TextResolver;
use App\Records\Contracts\RecordResolver;
use App\Support\RecordReference;

/**
 * Answers a record's text version.
 */
final readonly class ReadTextVersionController
{
    public function __invoke(
        ReadTextVersionPayload $call,
        TextResolver $text,
        RecordResolver $records,
    ): TextVersionSummary {
        return $text->version($records->identify(RecordReference::parse($call->target)), $call->version);
    }
}
