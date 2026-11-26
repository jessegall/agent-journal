<?php

declare(strict_types=1);

namespace App\Docking\Values;

use App\Docking\Cards\ConsoleOutput;
use App\Docking\Sources\Contracts\CardContext;
use App\Processes\Cards\StateLabel;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\Tone;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\Stack;
use App\Support\Cards\Title;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;

/**
 * One stream of one part of a run, as a dock shows it: the latest attempt's bounded tail, read without recording any
 * evidence. Its key names the run, the part and the stream, never an output row or a file.
 */
final readonly class DockedOutput implements Dockable
{
    /**
     * @param  list<string>  $lines
     */
    public function __construct(
        public string $runId,
        public int $part,
        public OutputStream $stream,
        private int $attempt,
        private array $lines,
        private bool $isTruncated,
    ) {}

    public static function keyOf(string $runId, int $part, OutputStream $stream): string
    {
        return "{$runId}:{$part}:{$stream->value}";
    }

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity(self::keyOf($this->runId, $this->part, $this->stream));
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        $attempt = $this->attempt > 1 ? " (attempt {$this->attempt})" : '';
        $label = "Part {$this->part} · {$this->stream->value}{$attempt}";

        if ($this->lines === []) {
            return DockCard::named($label, Stack::of(
                'root',
                new Title('title', $label),
                new StateLabel('state', 'Waiting for output', Tone::Muted),
            ));
        }

        return DockCard::named($label, Stack::of(
            'root',
            new Title('title', $label),
            new ConsoleOutput('output', $this->stream->consoleStream(), $this->lines, $this->isTruncated),
        ));
    }
}
