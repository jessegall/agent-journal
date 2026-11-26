<?php

declare(strict_types=1);

namespace Domain\Sharing\Contracts;

/**
 * A domain that brings share gateways: each gateway key, such as ngrok, with the class that drives it.
 */
interface ShareGatewayProvider
{
    /**
     * @return array<string, class-string<ShareGateway>>
     */
    public function shareGateways(): array;
}
