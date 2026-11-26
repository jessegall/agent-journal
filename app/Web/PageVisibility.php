<?php

declare(strict_types=1);

namespace App\Web;

use App\Actors\Contracts\CurrentActor;
use App\Navigation\Contracts\ClientOwnerAvailability;
use App\Support\ClientDeclarations;
use Illuminate\Contracts\Container\Container;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Whether the actor may see a declared page or section by its key: its owner is available and each of its visibility
 * checks allows the actor. What it may not see answers as missing, the same as what does not exist.
 */
final readonly class PageVisibility
{
    public function __construct(
        private ClientDeclarations $declarations,
        private CurrentActor $actors,
        private Container $container,
        private ClientOwnerAvailability $owners,
    ) {}

    public function assertVisible(string $key): void
    {
        if (! $this->isVisible($key)) {
            throw new NotFoundHttpException();
        }
    }

    public function isVisible(string $key): bool
    {
        if (! $this->owners->isAvailable($this->declarations->ownerOf($key))) {
            return false;
        }

        $actor = $this->actors->actor();

        return array_all(
            $this->declarations->visibilityChecksOf($key),
            fn (string $checkClass) => $this->container->make($checkClass)->allows($actor),
        );
    }
}
