<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\StartRefusal;
use App\Agents\Models\StartRecord;
use App\Agents\Values\StartRequest;
use Closure;
use Illuminate\Container\Attributes\Scoped;
use PhpOption\Option;

/**
 * The refusals of starts that ran inside another command's transaction, held in this request until that outermost
 * transaction has rolled back, then kept on their records.
 */
#[Scoped]
final class HeldStartRefusals
{
    /**
     * @var list<Closure(): StartRecord>
     */
    private array $refusals = [];

    /**
     * @param  Option<string>  $replyInboxId
     */
    public function hold(
        StartRequest $request,
        ActorIdentity $requester,
        Option $replyInboxId,
        StartRefusal $refusal,
    ): void {
        $this->refusals[] = fn () => StartRecord::keepRefusal($request, $requester, $replyInboxId, $refusal);
    }

    /**
     * Keeps every held refusal on its record, each in its own statement outside any transaction, and holds none after.
     */
    public function keep(): void
    {
        $refusals = $this->refusals;
        $this->refusals = [];

        foreach ($refusals as $keepRefusal) {
            $keepRefusal();
        }
    }

    public function forget(): void
    {
        $this->refusals = [];
    }
}
