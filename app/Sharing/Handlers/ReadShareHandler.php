<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Bus\Support\RunningCommand;
use App\Contracts\CommandHandler;
use App\Reads\Contracts\ReadMeter;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Contracts\ShareBudget;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareRelationType;
use App\Sharing\Exceptions\ShareBudgetExceeded;
use App\Sharing\Exceptions\ShareReadNested;
use App\Sharing\Exceptions\ShareReadRefused;
use App\Sharing\Exceptions\UnknownShareRecordType;
use App\Sharing\Exceptions\UnknownShareRelation;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareMember;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\OwnerSharePolicy;
use App\Sharing\Support\ReadPermits;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\ShareCursor;
use App\Sharing\Support\ShareCursors;
use App\Sharing\Support\SharedPage;
use App\Sharing\Support\SharedPageItem;
use App\Sharing\Support\ShareReadPath;
use App\Sharing\Support\ShareRecordRegistry;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareTargetRead;

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
    public function handle(ReadShare $command): SharedPage
    {
        if ($this->running->name() !== ReadShare::class) {
            throw ShareReadNested::insideAnother();
        }

        $permit = $this->permits->take($command->permitReference);
        $share = Share::lockForRead($permit->shareId);
        $root = $share->root();

        if (! $share->isReadableNow() || ! $this->policy->grantHolds($share) || ! $this->records->provider($root->type)->mayDisclose($root)) {
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
        ShareAudit::recordFor($share, ShareAuditType::ReadAllowed, ActorIdentity::system(), null);

        return $page;
    }

    /**
     * Every step is a linked record the current scope approves over a link that still exists; children are read
     * through their parent's page, never by path.
     */
    private function followsApprovedSteps(Share $share, RecordIdentity $root, ShareReadPath $path): bool
    {
        $from = $root;

        foreach ($path->hops as $hop) {
            $relation = $this->records->relation($from->type, $hop->relation);

            if ($relation->type !== ShareRelationType::Linked || ! ShareMember::approvesOverLiveLink($share, $from, $hop->target)) {
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
    private function read(Share $share, RecordIdentity $target, ShareReadPath $path, ReadShare $command): SharedPage
    {
        $budget = MeteredShareBudget::forRead($this->meter);
        $provider = $this->records->provider($target->type);
        $content = $budget->run(fn () => $provider->content(new ShareContentRead($target), $budget));
        $linked = $this->linkedFrom($share, $target, $budget);
        [$children, $next] = $this->childrenOf($share, $target, $path, $command->cursor, $budget);
        $body = $command->head ? '' : $content->body;
        $budget->chargeRendered(strlen($body) + strlen($content->card->title));

        return new SharedPage(true, $content->card->title, $content->card->publicationVersion, $body, $linked, $children, $next);
    }

    /**
     * The approved records linked from the target that their providers may disclose now.
     *
     * @return list<SharedPageItem>
     */
    private function linkedFrom(Share $share, RecordIdentity $target, ShareBudget $budget): array
    {
        $items = [];

        foreach (ShareMember::approvedTargetsFrom($share, $target) as $type => $targets) {
            if (! $this->records->has($type)) {
                continue;
            }

            $provider = $this->records->provider($type);
            $page = $budget->run(fn () => $provider->readTargets(new ShareTargetRead([$target], $targets, null), $budget));
            array_push($items, ...array_map(SharedPageItem::fromCard(...), $page->eligible));
        }

        return $items;
    }

    /**
     * One page of the target's first owned relation, and the signed cursor of the next page.
     *
     * @return array{list<SharedPageItem>, string|null}
     *
     * @throws ShareReadRefused
     */
    private function childrenOf(Share $share, RecordIdentity $target, ShareReadPath $path, string|null $cursor, ShareBudget $budget): array
    {
        $owned = array_values(array_filter($this->records->relations($target->type)->relations, fn ($relation) => $relation->type === ShareRelationType::Owned));

        if ($owned === []) {
            return [[], null];
        }

        $relation = $owned[0]->name;
        $place = new ShareCursor($share->id, $share->scope_version, $path->text, $relation, ShareCursor::ORDER_WRITTEN_THEN_ID, '');
        $continuation = $cursor === null ? null : $this->cursors->read($cursor, $place)->continuation;
        $provider = $this->records->provider($target->type);
        $page = $budget->run(fn () => $provider->readRelated(new ShareRelationRead($target, $relation, self::CHILDREN_PAGE, $continuation), $budget));
        $next = $page->continuation === null ? null : $this->cursors->write(new ShareCursor($share->id, $share->scope_version, $path->text, $relation, ShareCursor::ORDER_WRITTEN_THEN_ID, $page->continuation));

        return [array_map(SharedPageItem::fromCard(...), $page->eligible), $next];
    }

    private function deny(Share $share, string $reason): SharedPage
    {
        ShareAudit::recordFor($share, ShareAuditType::ReadDenied, ActorIdentity::system(), $reason);

        return SharedPage::denied();
    }
}
