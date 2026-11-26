<?php

declare(strict_types=1);

namespace Domain\Chat\Values;

use App\Processes\Enums\OutputStream;
use App\Processes\Enums\Tone;
use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Enums\ConsoleStream;
use Domain\Chat\Support\Cards\ConsoleOutput;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\StateLabel;
use Domain\Chat\Support\Cards\Title;

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
            new ConsoleOutput('output', ConsoleStream::of($this->stream), $this->lines, $this->isTruncated),
        ));
    }
}
