<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Concerns\LinksTargetsOneByOne;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Notifications\NotificationTargetResolver;
use App\Contracts\Navigation\DeclaredPages;
use App\Data\Notifications\NotificationLink;
use App\Enums\AskResult;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Support\ActorIdentity;
use PhpOption\Option;

/**
 * A merge request notification leads to the exact ask's page while the reader is its current holder, and stays as
 * read-only history for the final holder once the ask ended: Merged only on a merged attempt, otherwise Settled.
 * Anyone else is never told it exists.
 */
final readonly class MergeAskNotificationTarget implements NotificationTargetResolver
{
    use LinksTargetsOneByOne;

    public const string KEY = 'merge.ask';

    private const string ASK_PAGE = 'web.ask';

    public function __construct(
        private CurrentActor $actors,
        private DeclaredPages $pages,
    ) {}

    /**
     * @return Option<NotificationLink>
     */
    private function linkFor(string $targetId): Option
    {
        $reader = ActorIdentity::of($this->actors->actor());

        return Ask::query()->acrossActors()->whereKey($targetId)->firstOption()
            ->filter(fn (Ask $ask) => AskHop::latestHolderOf($ask->id)
                ->map(fn (ActorIdentity $holder) => $holder->type === $reader->type && $holder->id === $reader->id)
                ->getOrElse(false))
            ->map(fn (Ask $ask) => new NotificationLink(
                $this->titleOf($ask),
                $this->pages->addressOf(self::ASK_PAGE, ['ask' => $ask->id]),
            ));
    }

    public function disclosesMissing(): bool
    {
        return false;
    }

    private function titleOf(Ask $ask): string
    {
        $line = strtok($ask->body, "\n") ?: $ask->body;

        $result = AskResult::of($ask);

        if ($result === AskResult::Open) {
            return "Merge request: {$line}";
        }

        return "{$result->label()}: {$line}";
    }
}
