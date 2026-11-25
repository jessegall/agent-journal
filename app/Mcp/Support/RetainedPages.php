<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Exceptions\ContinuationStale;
use App\Mcp\Models\RetainedPage;
use App\Support\AgentContext;
use Carbon\CarbonImmutable;
use Closure;

/**
 * Keeps the ordered references of a numbered page the byte budget shortened, and resolves the omitted ones again under
 * the caller's current authorization when its continuation comes back. A retained page is walked to its end before
 * the next numbered page, which is a new live read.
 */
final readonly class RetainedPages
{
    public function __construct(private AgentContext $agent) {}

    /**
     * @param  list<string>  $references
     */
    public function keep(array $references): string
    {
        return RetainedPage::create(
            $this->agent,
            $references,
            CarbonImmutable::now()->addMinutes(Continuations::LIFETIME_MINUTES),
        )->id;
    }

    /**
     * The entries from the offset on, each read by the reader, which returns only those the caller may still see,
     * keyed by reference.
     *
     * @template T
     *
     * @param  Closure(list<string>): array<string, T>  $read
     * @return RetainedEntries<T>
     *
     * @throws ContinuationStale
     */
    public function resolve(string $pageId, int $offset, Closure $read): RetainedEntries
    {
        $page = RetainedPage::query()->whereKey($pageId)->unexpiredAt(CarbonImmutable::now())->firstOr(
            ContinuationStale::throwing()->expired(),
        );

        $references = array_slice($page->references, $offset);
        $found = $read($references);
        $visibleRecords = [];
        $offsets = [];

        foreach ($references as $index => $reference) {
            if (! array_key_exists($reference, $found)) {
                continue;
            }

            $visibleRecords[$reference] = $found[$reference];
            $offsets[$reference] = $offset + $index;
        }

        return new RetainedEntries($visibleRecords, $offsets, count($references) - count($visibleRecords));
    }
}
