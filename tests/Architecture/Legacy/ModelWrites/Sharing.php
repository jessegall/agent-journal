<?php

declare(strict_types=1);

/**
 * The model methods of Sharing that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'ShareAudit::removeAll' => 5,
    'ShareGatewayConfiguration::makeDefault' => 5,
    'ShareGatewayEndpoint::stopAllButRun' => 5,
    'ShareGatewayOperation::cancelOpensOf' => 5,
    'ShareGatewayOperation::releaseAllButRun' => 5,
    'ShareInstallation::create' => 5,
    'ShareMember::forgetAllOf' => 5,
    'ShareMember::invalidateForLinks' => 5,
];
