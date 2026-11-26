<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Reads\Contracts\TextResolver;
use App\Records\Contracts\RecordResolver;
use App\Support\RecordReference;
use App\Support\TextPart;
use App\Text\Api\ReadTextPayload;

/**
 * Answers the lines or section of a text version asked for.
 */
final readonly class ReadTextController
{
    public function __invoke(ReadTextPayload $call, TextResolver $text, RecordResolver $records): TextPart
    {
        $target = $records->identify(RecordReference::parse($call->target));

        return $text->read($target, $call->version, $call->selection());
    }
}
