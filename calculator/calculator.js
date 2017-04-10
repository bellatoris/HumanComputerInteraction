$(function() {
    var currentTable = '#table1';
    $('.select').click(function() {
        var tableNumber = $(this).text();
        currentTable = '#table' + tableNumber;

        $('div').css('display', 'none');
        $(currentTable).css('display', 'block');
    });

    function inCurrentTable(input) {
        return currentTable + ' ' + input;
    }

    // state
    // implement calculator by using finite state machine.
    // state = 0 => initial state
    // state = 1 => left operand is changed
    // state = 2 => left operand and operator are changed.
    // state = 3 => left operand, right operand and operator are changed.
    // state = 4 => result is pushed.
    var state = {
        leftOperand: '',
        rightOperand: '',
        operator: '',
        clearState: 'C',
        stateNumber: 0,
    };

    var memory = 0;

    function initState() {
        state.leftOperand = '';
        state.rightOperand = '';
        state.operator = '';
        state.clearState = 'C';
        state.stateNumber = 0;

        $('.clear').text(state.clearState);
        $('#output').attr('value', 0);
        $('#result').attr('value', 0);
        $('.operator').css('background-color', 'buttonface');
    }

    $('#state').click(function() {
        $(this).text(state.stateNumber);
    });
    

    // memory state 
    $('.mReset').click(function() {
        state.clearState = 'CE';
        $('.clear').text(state.clearState);

        switch (state.stateNumber) {
            case 0:
            case 1: {
                // init ,state1 -> state1
                state.stateNumber = 1;

                state.leftOperand = memory;
                $('#output').attr('value', memory);
                break;
            }
            case 2:
            case 3: {
                // state2, state3 -> state3
                state.stateNumber = 3;

                state.rightOperand = memory;
                $('#output').attr('value', memory);
                break;
            }
            case 4: {
                // state4 -> state1
                state.stateNumber = 1;

                state.operator = '';
                state.rightOperand = '';
                state.leftOperand = memory;
                $('#output').attr('value', memory);
                break;
            }
        }
    });

    $('.mPlus').click(function() {
        var number = $('#output').attr('value');
        memory += parseInt(number, 10);

        $('#memory').attr('value', memory);
    });

    $('.mMinus').click(function() {
        var number = $('#output').attr('value');
        memory -= parseInt(number, 10);

        $('#memory').attr('value', memory);
    });

    $('.mClear').click(function() {
        memory = 0;

        $('#memory').attr('value', memory);
    })

    // calculator state
    $('.number').click(function() {
        var number = $(this).text();

        state.clearState = 'CE';
        $('.clear').text(state.clearState);

        switch (state.stateNumber) {
            case 0:
            case 1: {
                // init ,state1 -> state1
                state.stateNumber = 1;

                var input = $('#output').attr('value');
                if (input === '0')
                    input = number;
                else
                    input += number;
                state.leftOperand = parseInt(input);
                $('#output').attr('value', input);
                break;
            }
            case 2: {
                // state2 -> state3
                state.stateNumber = 3;

                state.rightOperand = parseInt(number);
                $('#output').attr('value', number);
                break;
            }
            case 3: {
                // state3 -> state3
                state.stateNumber = 3;

                var input = $('#output').attr('value');
                if (input === '0')
                    input = number;
                else
                    input += number;
                state.rightOperand = parseInt(input);
                $('#output').attr('value', input);
                break;
            }
            case 4: {
                // state4 -> state1
                state.stateNumber = 1;

                state.operator = '';
                state.rightOperand = '';
                state.leftOperand = parseInt(number, 10);
                $('#output').attr('value', number);
                break;
            }
        }
    });

    $('.operator').click(function() {
        var operator = $(this).text();

        $('.operator').css('background-color', 'buttonface');
        $(this).css('background-color', 'red');

        state.clearState = 'CE';
        $('.clear').text(state.clearState);

        switch (state.stateNumber) {
            case 0: {
                // init -> state2
                state.stateNumber = 2;

                state.leftOperand = 0;
                state.operator = operator;
                break;
            }
            case 1:
            case 2: {
                // state1, state2 -> state2
                state.stateNumber = 2;

                state.operator = operator;
                $('#result').attr('value', state.leftOperand);
                break;
            }
            case 3: {
                // state3 -> state2
                state.stateNumber = 2;

                state.leftOperand = operate(state);
                state.operator = operator;
                state.rightOperand = '';
                $('#output').attr('value', state.leftOperand);
                $('#result').attr('value', state.leftOperand);
                break;
            }
            case 4: {
                // state4 -> state2
                state.stateNumber = 2;

                state.operator = operator;
                state.rightOperand = '';
                break;
            }
        }
    });

    $('.result').click(function() {
        $('.operator').css('background-color', 'buttonface');

        switch (state.stateNumber) {
            case 0:
            case 1: {
                // init, state1 -> init, state1 respectively
                break;
            }
            case 2: {
                // state2 -> state4
                state.stateNumber = 4;

                state.rightOperand = state.leftOperand;
                state.leftOperand = operate(state);
                $('#output').attr('value', state.leftOperand);
                $('#result').attr('value', state.leftOperand);

                state.clearState = 'CE';
                $('.clear').text(state.clearState);
                break;
            }
            case 3:
            case 4: {
                // state3, state4 -> state4
                state.stateNumber = 4;

                state.leftOperand = operate(state);
                $('#output').attr('value', state.leftOperand);
                $('#result').attr('value', state.leftOperand);

                state.clearState = 'CE';
                $('.clear').text(state.clearState);
                break;
            }
        }
    });

    $('.clear').click(function() {
        switch (state.stateNumber) {
            case 0:
            case 1: {
                // init, state1 -> init
                initState();
                break;
            }
            case 2:
            case 3:
            case 4:  {
                if (state.clearState === 'CE') {
                    state.clearState = 'C'
                    $('#output').attr('value', 0);
                    $('.clear').text(state.clearState);
                } else {
                    initState();
                }
                break;
            }
        }
    });

    function operate(state) {
        leftOperand = state.leftOperand;
        rightOperand = state.rightOperand;
        operator = state.operator;

        switch (operator) {
            case '+': return leftOperand + rightOperand;
            case '-': return leftOperand - rightOperand;
            case '*': return leftOperand * rightOperand;
            case '/': return leftOperand / rightOperand;
        }
    }
})
