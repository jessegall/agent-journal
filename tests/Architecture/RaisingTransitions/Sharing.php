<?php

declare(strict_types=1);

/**
 * The Sharing transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'Share::activate',
    'Share::advanceScope',
    'Share::approveAs',
    'Share::create',
    'Share::end',
    'Share::failActivation',
    'ShareGatewayConfiguration::create',
    'ShareGatewayConfiguration::disable',
];
