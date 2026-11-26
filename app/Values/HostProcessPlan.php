<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Hosts\RestartPolicy;
use App\Support\ContainerManifest;

/**
 * How a host is to open one process: what it is for, terminal or pipes, whether it is healed, its argv and
 * environment, its folder, and the container it runs in when it is contained.
 */
final readonly class HostProcessPlan
{
    /**
     * @param  list<string>  $argv
     * @param  array<string, string>  $environment
     */
    public function __construct(
        public HostProcessPurpose $purpose,
        public HostProcessType $type,
        public RestartPolicy $restart,
        public array $argv,
        public array $environment,
        public string $folder,
        public ContainerManifest|null $container = null,
        public int $columns = 120,
        public int $rows = 40,
    ) {}

    public function orderType(): HostOrderType
    {
        return $this->container === null ? HostOrderType::OpenProcess : HostOrderType::OpenContainer;
    }

    /**
     * The order's payload as the host reads it.
     *
     * @return array<string, mixed>
     */
    public function payload(): array
    {
        return [
            'type' => $this->type->value,
            'restart' => $this->restart->value,
            'argv' => $this->argv,
            'environment' => $this->environment,
            'folder' => $this->folder,
            'container' => $this->container,
            'size' => ['columns' => $this->columns, 'rows' => $this->rows],
        ];
    }
}
