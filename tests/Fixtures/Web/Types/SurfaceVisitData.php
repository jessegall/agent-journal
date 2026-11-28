<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

use App\Declarations\SlotContext;
use App\Support\ActorReference;
use App\Web\Attributes\ActingActor;
use App\Web\Attributes\CopyScoped;
use App\Web\Attributes\Live;
use App\Web\Attributes\Optional as OptionalProp;
use App\Web\Attributes\QueryInput;
use App\Web\Attributes\RouteKey;
use App\Web\Attributes\SlotArgument;
use App\Web\Attributes\WindowOnly;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;

#[WindowOnly, OptionalProp, Live, CopyScoped]
final class SurfaceVisitData extends Data
{
    public function __construct(
        #[ActingActor, Hidden] public readonly ActorReference $actor,
        #[RouteKey('agent')] public readonly string $target,
        #[QueryInput('label')] public readonly string $label,
        #[SlotArgument, Hidden] public readonly SlotContext|null $slot,
    ) {}
}
