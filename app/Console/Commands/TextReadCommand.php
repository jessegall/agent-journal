<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Text\ReadTextPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class TextReadCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'text:read {target : Such as "doc 12"} {--at-revision=} {--lines=} {--section=} {--json}';

    protected $description = 'Read a bounded part of one version of the text of a record; nextLine is where the next --lines starts';

    protected $help = 'Example: text:read "doc 12" --at-revision 4 --lines 12-30, or --section 3';

    public function handle(): int
    {
        $section = (string) $this->option('section');
        $span = preg_match('/^(\d+)-(\d*)$/', (string) $this->option('lines'), $lines) === 1 ? $lines : [];

        return $this->runCall(ReadTextPayload::from([
            'target' => (string) $this->argument('target'),
            'version' => (string) $this->option('at-revision'),
            'section' => $section === '' ? null : $section,
            'firstLine' => self::lineOf($span[1] ?? ''),
            'lastLine' => self::lineOf($span[2] ?? ''),
        ]));
    }

    /**
     * The line number a --lines bound names; none when the bound is left out.
     */
    private static function lineOf(string $bound): int|null
    {
        if ($bound === '') {
            return null;
        }

        return (int) $bound;
    }
}
