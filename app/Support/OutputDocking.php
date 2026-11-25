<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\OutputStream;
use App\Exceptions\DockSourceUnavailable;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\Cards\ComposedCard;
use App\Support\Cards\ConsoleOutput;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;
use App\Values\DockedOutput;
use Illuminate\Database\Eloquent\Collection;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Reads docked output through the actor-scoped run query alone, so another actor's output is not found and gives no
 * bytes. Each key names a run, a part and a stream; the latest attempt of the part is read, and nothing is recorded
 * as evidence read.
 */
final readonly class OutputDocking implements DockableProvider
{
    /**
     * The type docked output goes under.
     */
    public const string DOCK_TYPE = 'process.output';

    public function __construct(private StoredOutput $output) {}

    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return $this->outputs([$id])[$id] ?? throw DockSourceUnavailable::of($definition->type, $id);
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        foreach ($this->outputs($ids) as $output) {
            $cards[] = new ComposedCard($output->identifyFor($definition), $output->composeDockCard($context));
        }

        return $cards;
    }

    /**
     * @param  list<string>  $ids
     * @return array<string, DockedOutput>
     */
    private function outputs(array $ids): array
    {
        $keys = array_filter(array_map(self::parsed(...), $ids), fn (Option $key) => $key->isDefined());
        $runIds = array_values(array_unique(array_map(fn (Option $key) => $key->get()[0], $keys)));

        $runs = ProcessRun::query()
            ->withDockParts()
            ->whereKey($runIds)
            ->readExactly(count($runIds))
            ->get()
            ->keyBy('id');

        $outputs = [];

        foreach ($keys as $id => $key) {
            [$runId, $part, $stream] = $key->get();
            $run = $runs->get($runId);
            $attempt = $run === null ? null : self::latestAttempt($run->parts, $part);

            if ($attempt === null) {
                continue;
            }

            $outputs[$ids[$id]] = $this->docked($runId, $attempt, $stream);
        }

        return $outputs;
    }

    private function docked(string $runId, PartRun $attempt, OutputStream $stream): DockedOutput
    {
        $tail = $this->output->tail($attempt, $stream, ConsoleOutput::LINE_LIMIT);
        $lines = $tail['text'] === '' ? [] : explode("\n", $tail['text']);

        return new DockedOutput($runId, $attempt->syntax_node, $stream, $attempt->attempt, $lines, $tail['before'] > 0);
    }

    /**
     * @param  Collection<int, PartRun>  $parts
     */
    private static function latestAttempt(Collection $parts, int $part): PartRun|null
    {
        return $parts->where('syntax_node', $part)->sortByDesc('attempt')->first();
    }

    /**
     * The run, part and stream a key names, or none for a key no output has.
     *
     * @return Option<array{0: string, 1: int, 2: OutputStream}>
     */
    private static function parsed(string $id): Option
    {
        $pieces = explode(':', $id);

        if (count($pieces) !== 3 || ! ctype_digit($pieces[1])) {
            return None::create();
        }

        $stream = OutputStream::tryFrom($pieces[2]);

        if ($stream === null) {
            return None::create();
        }

        return Some::create([
            $pieces[0],
            (int) $pieces[1],
            $stream,
        ]);
    }
}
