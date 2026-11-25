<?php

declare(strict_types=1);

namespace App\Calls\Text;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Support\TextPart;
use App\Support\TextSelection;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\GreaterThanOrEqualTo;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Prohibits;
use Spatie\LaravelData\Data;

/**
 * Reads lines or one section of one version of a record's text.
 *
 * @implements JournalCall<TextPart>
 */
#[Endpoint('text/read', 'POST', TextPart::class, CallEffect::Read)]
final class ReadTextCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(64)]
        public string $target,
        #[Max(64)]
        public string $version,
        #[Max(200), Prohibits('first_line', 'last_line')]
        public string|null $section = null,
        #[MapName('first_line'), Min(1)]
        public int|null $firstLine = null,
        #[MapName('last_line'), Min(1), GreaterThanOrEqualTo('first_line')]
        public int|null $lastLine = null,
    ) {}

    public function selection(): TextSelection
    {
        if ($this->section !== null) {
            return TextSelection::from(['section' => $this->section]);
        }

        return TextSelection::from([
            'firstLine' => $this->firstLine ?? 1,
            'lastLine' => $this->lastLine,
        ]);
    }
}
