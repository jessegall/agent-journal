<?php

declare(strict_types=1);

namespace App\Data\Sharing;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of the form that configures a share gateway, a native part of the gateway settings: the gateways the
 * registry offers, the first chosen at the start.
 */
#[TypeScript]
final class GatewayConfigurePartData extends Data
{
    /**
     * @param  list<string>  $gatewayKeys
     */
    public function __construct(public readonly array $gatewayKeys) {}
}
