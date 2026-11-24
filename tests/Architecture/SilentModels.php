<?php

declare(strict_types=1);

/**
 * The models whose mutations raise no event of their own (MutationEventsTest), each with the reason it cannot be an
 * event source: a save of an event source outside an event unit is refused, so a model the framework itself writes
 * outside any unit stays here.
 */
return [
    'User' => 'Laravel\'s guard and Fortify save the user outside any unit: the remember token at sign-in, the '
        .'verified email, the two-factor secret and the passkeys.',
];
