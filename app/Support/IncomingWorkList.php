<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\IncomingWork;
use App\Contracts\Work\IncomingWorkRegistration;
use App\Exceptions\IncomingWorkFailed;
use App\Exceptions\IncomingWorkRepeated;
use Illuminate\Contracts\Container\Container;
use Throwable;

/**
 * The incoming work registered at boot, in order, each built from the container on every hook and accepted before
 * the stack is restored.
 */
final class IncomingWorkList implements IncomingWorkRegistration
{
    /**
     * @var list<class-string<IncomingWork>>
     */
    private array $workClasses = [];

    public function __construct(private readonly Container $container) {}

    public function register(string $class): void
    {
        if (in_array($class, $this->workClasses, true)) {
            throw IncomingWorkRepeated::forWork($class);
        }

        $this->workClasses[] = $class;
    }

    /**
     * @throws IncomingWorkFailed
     */
    public function acceptAll(): void
    {
        foreach ($this->workClasses as $workClass) {
            try {
                $this->container->make($workClass)->accept();
            } catch (Throwable $cause) {
                throw IncomingWorkFailed::forWork($workClass, $cause);
            }
        }
    }
}
