<?php

declare(strict_types=1);

/**
 * The Communication transitions that raise facts, each called only inside a unit: a command handler, a required
 * listener or a model (ModelRaiseCallerTest).
 */
return [
    'Message::acknowledge',
    'Message::answerWith',
    'Message::create',
    'Message::dismissBy',
    'Message::requireAnswer',
    'NotificationScope::addUnread',
    'NotificationScope::recordChange',
    'NotificationScope::removeUnread',
];
