<?php

declare(strict_types=1);

namespace App\Commands\ReadShare;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Reads\ReadMeter;
use App\Contracts\Sharing\ShareBudget;
use App\Enums\ShareAuditType;
use App\Enums\ShareRelationType;
use App\Exceptions\ShareBudgetExceeded;
use App\Exceptions\ShareReadNested;
use App\Exceptions\ShareReadRefused;
use App\Exceptions\UnknownShareRecordType;
use App\Exceptions\UnknownShareRelation;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareMember;
use App\Support\ActorIdentity;
use App\Support\MeteredShareBudget;
use App\Support\OwnerSharePolicy;
use App\Support\ReadPermits;
use App\Support\RecordIdentity;
use App\Support\RunningCommand;
use App\Support\ShareContentRead;
use App\Support\ShareCursor;
use App\Support\ShareCursors;
use App\Support\SharedPage;
use App\Support\SharedPageItem;
use App\Support\ShareReadPath;
use App\Support\ShareRecordRegistry;
use App\Support\ShareRelationRead;
use App\Support\ShareTargetRead;

/**
 * Reads one shared page inside the bus transaction: the share row locked for reading, its authority and every step
 * of the path checked in that snapshot, the record and its lists read within the read budget, and the audit row
 * appended before the page is returned. A known link that may not be read is denied and audited, not thrown.
 */
final readonly class ReadShareHandler implements CommandHandler
{
    private const int CHILDREN_PAGE = 50;

    public function __construct(
        private RunningCommand $running,
        private ReadPermits $permits,
        private OwnerSharePolicy $policy,
        private ShareRecordRegistry $records,
        private ShareCursors $cursors,
        private ReadMeter $meter,
    ) {}

    /**
     * @throws ShareReadNested when the read is not the request's top-level command
     * @throws ShareBudgetExceeded when the read would pass its budget
     */
    public function handle(ReadShareCommand $command): SharedPage
    {
        if ($this->running->name() !== ReadShareCommand::class) {
            throw ShareReadNested::insideAnother();
        }

        $permit = $this->permits->take($command->permitReference);
        $share = Share::lockForRead($permit->shareId);
        $root = $share->root;

        if (! $share->isReadableNow()
            || ! $this->policy->grantHolds($share)
            || ! $this->records->provider($root->type)->mayDisclose($root)) {
            return $this->deny($share, 'share');
        }

        try {
            $path = ShareReadPath::parse($command->path, $root, $this->records);
        } catch (ShareReadRefused|UnknownShareRelation|UnknownShareRecordType) {
            return $this->deny($share, 'path');
        }

        if (! $this->followsApprovedSteps($share, $root, $path)) {
            return $this->deny($share, 'path');
        }

        $page = $this->read($share, $path->target($root), $path, $command);
        ShareAudit::create($share, ShareAuditType::ReadAllowed, ActorIdentity::system(), null);

        return $page;
    }

    /**
     * Every step is a linked record the current scope approves over a link that still exists, and that its provider
     * may still disclose now; children are read through their parent's page, never by path.
     */
    private function followsApprovedSteps(Share $share, RecordIdentity $root, ShareReadPath $path): bool
    {
        $from = $root;

        foreach ($path->hops as $hop) {
            $relation = $this->records->relation($from->type, $hop->relation);

            if ($relation->type !== ShareRelationType::Linked
                || ! ShareMember::approvesOverLiveLink($share, $from, $hop->target)) {
                return false;
            }

            if (! $this->records->provider($hop->target->type)->mayDisclose($hop->target)) {
                return false;
            }

            $from = $hop->target;
        }

        return true;
    }

    /**
     * @throws ShareBudgetExceeded
     * @throws ShareReadRefused when the cursor belongs to another place
     */
    private function read(
        Share $share,
        RecordIdentity $target,
        ShareReadPath $path,
        ReadShareCommand $command,
    ): SharedPage {
        $budget = MeteredShareBudget::forRead($this->meter);
        $provider = $this->records->provider($target->type);
        $content = $budget->run(fn () => $provider->content(new ShareContentRead($target), $budget));
        $linked = $this->linkedFrom($share, $target, $budget);
        [$children, $next] = $this->childrenOf($share, $target, $path, $command->cursor, $budget);
        $body = $command->isHead ? '' : $content->body;
        $budget->chargeRendered(strlen($body) + strlen($content->card->title));

        return new SharedPage(
            true,
            $content->card->title,
            $content->card->publicationVersion,
            $body,
            $linked,
            $children,
            $next,
        );
    }

    /**
     * The approved records linked from the target that their providers may disclose now.
     *
     * @return list<SharedPageItem>
     */
    private function linkedFrom(Share $share, RecordIdentity $target, ShareBudget $budget): array
    {
        $cards = [];

        foreach (ShareMember::approvedTargetsFrom($share, $target) as $type => $targets) {
            if (! $this->records->has($type)) {
                continue;
            }

            $provider = $this->records->provider($type);

            $page = $budget->run(
                fn () => $provider->readTargets(new ShareTargetRead([$target], $targets, null), $budget),
            );

            array_push($cards, ...array_map(SharedPageItem::fromCard(...), $page->eligible));
        }

        return $cards;
    }

    /**
     * One page of the target's first owned relation, and the signed cursor of the next page.
     *
     * @return array{list<SharedPageItem>, string|null}
     *
     * @throws ShareReadRefused
     */
    private function childrenOf(
        Share $share,
        RecordIdentity $target,
        ShareReadPath $path,
        string|null $cursor,
        ShareBudget $budget,
    ): array {
        $owned = array_values(
            array_filter(
                $this->records->relations($target->type)->relations,
                fn ($relation) => $relation->type === ShareRelationType::Owned,
            ),
        );

        if ($owned === []) {
            return [[], null];
        }

        $relation = $owned[0]->name;

        $place = new ShareCursor(
            $share->id,
            $share->scope_version,
            $path->text,
            $relation,
            ShareCursor::ORDER_WRITTEN_THEN_ID,
            '',
        );

        $continuation = $cursor === null ? null : $this->cursors->read($cursor, $place)->continuation;
        $provider = $this->records->provider($target->type);

        $page = $budget->run(
            fn () => $provider->readRelated(
                new ShareRelationRead($target, $relation, self::CHILDREN_PAGE, $continuation),
                $budget,
            ),
        );

        $next = $page->continuation === null ? null : $this->cursors->write(
            new ShareCursor(
                $share->id,
                $share->scope_version,
                $path->text,
                $relation,
                ShareCursor::ORDER_WRITTEN_THEN_ID,
                $page->continuation,
            ),
        );

        return [array_map(SharedPageItem::fromCard(...), $page->eligible), $next];
    }

    private function deny(Share $share, string $reason): SharedPage
    {
        ShareAudit::create($share, ShareAuditType::ReadDenied, ActorIdentity::system(), $reason);

        return SharedPage::denied();
    }
}
