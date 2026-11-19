<?php

declare(strict_types=1);

namespace App\Text\Http\Controllers\Calls;

use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use App\Text\Calls\ReadTextCall;
use App\Text\Contracts\TextResolver;
use App\Text\Support\TextPart;

/**
 * Answers the lines or section of a text version asked for.
 */
final readonly class ReadTextController
{
    public function __invoke(ReadTextCall $call, TextResolver $text, RecordResolver $records): TextPart
    {
        $target = $records->identify(RecordReference::parse($call->target));

        return $text->read($target, $call->version, $call->selection());
    }
}
