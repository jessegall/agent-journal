<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Stacks\Contracts\Work\IncomingWork;
use App\Stacks\Contracts\Work\IncomingWorkRegistration as IncomingWorkRegistrationContract;
use App\Stacks\Exceptions\IncomingWorkFailed;
use App\Stacks\Exceptions\IncomingWorkRepeated;
use Illuminate\Contracts\Container\Container;
use Throwable;

/**
 * The incoming work registered at boot, in order, each built from the container on every hook and accepted before
 * the stack is restored.
 */
final class IncomingWorkRegistration implements IncomingWorkRegistrationContract
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
