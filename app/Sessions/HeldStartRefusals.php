<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Contracts\Refusals\StartRefusal;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorReference;
use App\Support\StackTransaction;
use App\Values\PinnedDriver;
use App\Values\StartRequest;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * The refusals of starts that ran inside another command's transaction, held in this request until that outermost
 * transaction has rolled back, then kept on their records.
 */
#[Scoped]
final class HeldStartRefusals
{
    /**
     * @var list<Closure(): void>
     */
    private array $refusals = [];

    public function __construct(private readonly StackTransaction $transaction) {}

    public function hold(
        StartRequest $request,
        PinnedDriver $pin,
        ActorReference $requester,
        StartRefusal $refusal,
    ): void {
        $this->refusals[] = fn () => SessionRequest::create($request, $pin, $requester)->refuse($refusal);
    }

    /**
     * Keeps every held refusal on its record, each in a unit of its own after the rollback, and holds none after.
     */
    public function keep(): void
    {
        $refusals = $this->refusals;
        $this->refusals = [];

        foreach ($refusals as $keepRefusal) {
            $this->transaction->run($keepRefusal);
        }
    }

    public function forget(): void
    {
        $this->refusals = [];
    }
}
