<?php

declare(strict_types=1);

namespace Domain\Memory\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use Domain\Memory\Api\MemoryCard;
use Domain\Memory\Api\MemoryPage;
use Domain\Memory\Contracts\MemoryReader;
use Domain\Memory\Models\Memory;

/**
 * Reads one page of the memories of this request's actor, heaviest first.
 */
final readonly class OwnMemories implements MemoryReader
{
    public function __construct(private CurrentActor $actors) {}

    public function own(int $page): MemoryPage
    {
        $owner = ActorIdentity::of($this->actors->actor());
        $query = Memory::query()->ownedBy($owner);
        $total = $query->clone()->count();
        $cards = $query->orderByDesc('weight')->orderBy('id')->forPage($page, self::PER_PAGE)->readLimit(self::PER_PAGE)->get()
            ->map(fn (Memory $memory): MemoryCard => new MemoryCard($memory->id, $memory->number, $memory->text, $memory->weight))
            ->all();

        return new MemoryPage(array_values($cards), $page, self::PER_PAGE, $total);
    }
}
