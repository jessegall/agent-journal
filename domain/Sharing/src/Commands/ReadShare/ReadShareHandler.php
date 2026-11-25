<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\ReadShare;

use App\Contracts\Reads\ReadMeter;
use App\Contracts\Sharing\ShareBudget as ShareBudgetContract;
use App\Enums\Sharing\ShareRelationType;
use App\Exceptions\ShareBudgetExceeded;
use App\Exceptions\UnknownShareRecordType;
use App\Exceptions\UnknownShareRelation;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Support\RunningCommand;
use App\Support\ShareContentRead;
use App\Support\ShareRecordRegistry;
use App\Support\ShareRelationRead;
use App\Support\ShareTargetRead;
use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Exceptions\ShareReadNested;
use Domain\Sharing\Exceptions\ShareReadRefused;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareMember;
use Domain\Sharing\Support\OwnerSharePolicy;
use Domain\Sharing\Support\ReadPermits;
use Domain\Sharing\Support\ShareBudget;
use Domain\Sharing\Support\ShareCursor;
use Domain\Sharing\Support\ShareCursors;
use Domain\Sharing\Support\SharedPage;
use Domain\Sharing\Support\SharedPageItem;
use Domain\Sharing\Support\ShareReadPath;

/**
 * Reads one shared page inside the bus transaction: the share row locked for reading, its authority and every step
 * of the path checked in that snapshot, the record and its lists read within the read budget, and the audit row
 * appended before the page is returned. A known link that may not be read is denied and audited, not thrown.
 */
final readonly class ReadShareHandler extends SharingCommandHandler
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
        $share = Share::findLockedForRead($permit->shareId);
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
                || ! ShareMember::isApprovedOverLiveLink($share, $from, $hop->target)) {
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
        $budget = ShareBudget::forRead($this->meter);
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
    private function linkedFrom(Share $share, RecordIdentity $target, ShareBudgetContract $budget): array
    {
        $cards = [];

        foreach (ShareMember::resolveApprovedTargetsFrom($share, $target) as $type => $targets) {
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
        ShareBudgetContract $budget,
    ): array {
        $owned = array_values(
            array_filter(
                $this->records->relations($target->type)->relations,
                fn ($relation) => $relation->type === ShareRelationType::Owned,
            ),
        );

        if ($owned === []) {
            return [
                [],
                null,
            ];
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

        return [
            array_map(SharedPageItem::fromCard(...), $page->eligible),
            $next,
        ];
    }

    private function deny(Share $share, string $reason): SharedPage
    {
        ShareAudit::create($share, ShareAuditType::ReadDenied, ActorIdentity::system(), $reason);

        return SharedPage::denied();
    }
}
