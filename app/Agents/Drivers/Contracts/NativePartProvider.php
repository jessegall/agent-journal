<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

/**
 * A domain whose declared layouts mount native parts: the components, in its script folder, that a layout part may
 * name, so the browser's component list holds them.
 */
interface NativePartProvider
{
    /**
     * @return list<string> component files relative to the domain's script folder, such as RecordStatus.vue
     */
    public function nativeParts(): array;
}
