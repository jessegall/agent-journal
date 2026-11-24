<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Data\Notifications\NotificationLink;
use PhpOption\Option;

/**
 * A notification target whose page holds few of its targets, so each target's link is read on its own.
 */
trait LinksTargetsOneByOne
{
    /**
     * @param  list<string>  $ids
     * @return array<int|string, NotificationLink>
     */
    public function linksFor(array $ids): array
    {
        $links = [];

        foreach ($ids as $targetId) {
            $this->linkFor($targetId)->forAll(function (NotificationLink $link) use (&$links, $targetId): void {
                $links[$targetId] = $link;
            });
        }

        return $links;
    }

    /**
     * @return Option<NotificationLink>
     */
    abstract private function linkFor(string $targetId): Option;
}
