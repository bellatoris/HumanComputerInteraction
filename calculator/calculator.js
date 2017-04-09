$(function() {
    // state
    var input = '0';
    var operator = '';
    var leftOperand = '';
    var rightOperand = '';
    var resultClicked = true;

    $('.number').click(function() {
        var number = $(this).text();

        // if result is clicked just before, we need to reset
        // operands and operator.
        if (resultClicked) {
            leftOperand = '';
            rightOperand = '';
            operator = '';
            resultClicked = false;
        }

        if (input === '0')
            input = number;
        else 
            input += number;

        $('.clear').text('CE');
        $('#output').attr('value', input);
    })

    $('.operator').click(function() {
        resultClicked = false;
        
         if (input === '') {
            // rightOperand = '';
            return;
        } else {
            rightOperand = parseInt(input, 10);
            leftOperand = operate(leftOperand, rightOperand, operator);
        }

        input = '';
        $('#output').attr('value', leftOperand);
    })

    function operate(lefthOperand, rightOperand, operator) {
        switch (operator) {
            case 'add': return leftOperand + rightOperand;
            case 'sub': return leftOperand - rightOperand;
            case 'mul': return leftOperand * rightOperand;
            case 'div': return leftOperand / rightOperand;
            case '': if (rightOperand === '') return 0; else return rightOperand;
        } 
    }

    $('#add').click(function() {
        operator = 'add';
    })

    $('#sub').click(function() {
        operator = 'sub';
    })

    $('#mul').click(function() {
        operator = 'mul';
    })

    $('#div').click(function() {
        operator = 'div';
    })

    $('.clear').click(function() {
        if ($(this).text() === 'C') {
            leftOperand = '';
            operator = '';
            rightOperand = '';
        }

        input = '';
        $('.clear').text('C');
        $('#output').attr('value', 0);
    })

    $('.result').click(function() {
        if (input !== '') {
            rightOperand = parseInt(input, 10);
        } else if (rightOperand === '') {
            rightOperand = leftOperand;
        } 

        leftOperand = parseInt(operate(leftOperand, rightOperand, operator), 10);
        input = '';
        resultClicked = true;
        $('#output').attr('value', leftOperand);
    })

    $('td').mouseenter(function() {
        $(this).fadeTo('fast', 0.5);
    });

    $('td').mouseleave(function() {
        $(this).fadeTo('fast', 1);
    });
})
