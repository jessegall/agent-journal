<?php

declare(strict_types=1);

namespace App\Support\Web;

use App\Contracts\CurrentActor;
use App\Contracts\UiOwnerAvailability;
use App\Support\UiDeclarations;
use Illuminate\Contracts\Container\Container;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Whether the actor may see a declared page or section by its key: its owner is available and each of its visibility
 * checks allows the actor. What it may not see answers as missing, the same as what does not exist.
 */
final readonly class PageVisibility
{
    public function __construct(
        private UiDeclarations $declarations,
        private CurrentActor $actors,
        private Container $container,
        private UiOwnerAvailability $owners,
    ) {}

    public function assertVisible(string $key): void
    {
        if (! $this->owners->isAvailable($this->declarations->ownerOf($key))) {
            throw new NotFoundHttpException();
        }

        $actor = $this->actors->actor();

        foreach ($this->declarations->visibilityChecksOf($key) as $checkClass) {
            if (! $this->container->make($checkClass)->allows($actor)) {
                throw new NotFoundHttpException();
            }
        }
    }
}
