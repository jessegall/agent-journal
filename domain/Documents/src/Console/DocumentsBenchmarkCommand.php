<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Console\Support\ReadTiming;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Illuminate\Console\Command;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Str;

/**
 * Fills the library with published records through the bus and times its list and search reads: the p50 and p95
 * of each read, and the queries one page costs.
 */
final class DocumentsBenchmarkCommand extends Command
{
    protected $signature = 'documents:benchmark {--records=10000 : How many documents and reports the library should hold} {--runs=50 : How often each read is timed}';

    protected $description = 'Time the library list and search reads on a library of the given size';

    protected $help = 'Run it against a database you can throw away, for example the test database: it files records until the library holds --records of them. Example: php artisan documents:benchmark --records=10000 --runs=50';

    public function handle(CommandBus $commands, CurrentActorSetter $actors, DocumentReader $documents, ReportReader $reports, DatabaseManager $database): int
    {
        $actors->set(ActorContext::forUser((string) Str::ulid()));
        $wanted = (int) $this->option('records');
        $held = Document::query()->count() + Report::query()->count();

        for ($number = $held; $number < $wanted; $number++) {
            $body = self::bodyOf($number);
            $commands->run($number % 4 === 0 ? new CreateReport("Check {$number}", "What check {$number} found", $body) : new CreateDocument("Design {$number}", "What design {$number} says", $body));
        }

        $this->info('The library holds '.(Document::query()->count() + Report::query()->count()).' records.');
        $runs = (int) $this->option('runs');
        $reads = [
            'document list' => fn () => $documents->list(new DocumentFilters),
            'report list' => fn () => $reports->list(new DocumentFilters),
            'document search' => fn () => $documents->list(new DocumentFilters(query: 'retention window')),
            'report search' => fn () => $reports->list(new DocumentFilters(query: 'retention window')),
            'search that misses' => fn () => $documents->list(new DocumentFilters(query: 'no record holds this phrase')),
        ];

        foreach ($reads as $name => $read) {
            $timing = self::timed($read, $runs, $database);
            $this->line(sprintf('%-20s p50 %6.1f ms   p95 %6.1f ms   %d queries a page', $name, $timing->p50, $timing->p95, $timing->queries));
        }

        return self::SUCCESS;
    }

    /**
     * A Markdown body of about 20 KiB with headings, bullets and text; every tenth one names the searched phrase.
     */
    private static function bodyOf(int $number): string
    {
        $paragraph = 'The service keeps each event for a fixed time, then moves it to cold storage where it stays readable but slower to reach. ';
        $section = str_repeat($paragraph, 12);
        $phrase = $number % 10 === 0 ? "The retention window is thirty days for record {$number}.\n\n" : '';

        return "# Record {$number}\n\n{$phrase}".implode('', array_map(fn (int $part) => "## Part {$part}\n\n- point one\n- point two\n\n{$section}\n\n", range(1, 12)));
    }

    /**
     * @param  callable(): mixed  $read
     */
    private static function timed(callable $read, int $runs, DatabaseManager $database): ReadTiming
    {
        $read();
        $times = [];
        $connection = $database->connection();
        $connection->flushQueryLog();
        $connection->enableQueryLog();

        for ($run = 0; $run < $runs; $run++) {
            $started = hrtime(true);
            $read();
            $times[] = (float) ((hrtime(true) - $started) / 1_000_000);
        }

        $queries = intdiv(count($connection->getQueryLog()), max(1, $runs));
        $connection->disableQueryLog();

        return ReadTiming::of($times, $queries);
    }
}
